const PDFDocument = require('pdfkit');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');

// @desc    Generate and download certificate
// @route   GET /api/certificates/:eventId
// @access  Private/Student
const generateCertificate = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user._id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check registration and attendance
        const registration = await Registration.findOne({ event: eventId, user: userId });
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        if (registration.status !== 'attended') {
            return res.status(400).json({ message: 'Cannot generate certificate: You must attend the event first' });
        }

        // Check if certificate already generated
        let certificate = await Certificate.findOne({ event: eventId, user: userId });

        if (!certificate) {
            // Create new certificate record
            certificate = await Certificate.create({
                user: userId,
                event: eventId,
                registration: registration._id,
                certificateUrl: `/api/certificates/${eventId}/download`
            });
        }

        // Generate PDF using PDFKit
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
        });

        // Pipe the PDF directly to the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=certificate-${eventId}.pdf`
        );

        doc.pipe(res);

        // Draw the certificate
        // Add border (Optional but looks nice)
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

        // Add Logo (Optional)
        // doc.image('path/to/logo.png', 50, 45, { width: 50 })

        doc.font('Helvetica-Bold')
            .fontSize(40)
            .text('Certificate of Completion', 0, 150, { align: 'center' });

        doc.font('Helvetica')
            .fontSize(20)
            .text('This is to certify that', 0, 220, { align: 'center' });

        doc.font('Helvetica-Bold')
            .fontSize(30)
            .fillColor('#003366')
            .text(req.user.name, 0, 260, { align: 'center' });

        doc.font('Helvetica')
            .fontSize(20)
            .fillColor('black')
            .text(`has successfully attended the event`, 0, 310, { align: 'center' });

        doc.font('Helvetica-Bold')
            .fontSize(25)
            .text(`"${event.title}"`, 0, 350, { align: 'center' });

        doc.font('Helvetica')
            .fontSize(15)
            .text(`Held on ${new Date(event.date).toLocaleDateString()} at ${event.location}`, 0, 400, { align: 'center' });

        // Finalize PDF file
        doc.end();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        } else {
            console.error("Error generating PDF after headers sent:", error);
        }
    }
};

module.exports = {
    generateCertificate
};