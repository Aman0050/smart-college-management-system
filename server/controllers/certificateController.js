const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
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

        // Generate QR code data URI for embedding
        const qrCodeDataUrl = await QRCode.toDataURL(registration.qrCodeData, { margin: 1, color: { dark: '#0F172A', light: '#FFFFFF' } });

        // Generate PDF using PDFKit
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margins: { top: 40, bottom: 40, left: 40, right: 40 }
        });

        // Pipe the PDF directly to the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="Certificate_${req.user.name.replace(/\\s+/g, '_')}_${event.title}.pdf"`
        );

        doc.pipe(res);

        // --- Premium Certificate Layout ---
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // 1. Background Fill Layer (Soft ivory/white)
        doc.rect(0, 0, pageWidth, pageHeight).fill('#FAFAFA');

        // 2. Outer Dark Border
        doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
           .lineWidth(3)
           .strokeColor('#0F172A')
           .stroke();

        // 3. Inner Gold Border
        doc.rect(25, 25, pageWidth - 50, pageHeight - 50)
           .lineWidth(1)
           .strokeColor('#D4AF37')
           .stroke();

        // 4. Subtle watermark in the center
        doc.save();
        doc.translate(pageWidth / 2, pageHeight / 2);
        doc.rotate(-30);
        doc.font('Times-BoldItalic')
           .fontSize(100)
           .fillColor('#EAF0F6') // Very faint
           .fillOpacity(0.3)
           .text('POSEIFY', -200, -50);
        doc.restore();

        // Header
        doc.font('Times-Bold')
            .fontSize(44)
            .fillColor('#D4AF37')
            .fillOpacity(1)
            .text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center', characterSpacing: 2 });

        doc.moveTo(250, 155).lineTo(pageWidth - 250, 155).lineWidth(1).strokeColor('#D4AF37').stroke();

        doc.font('Times-Roman')
            .fontSize(18)
            .fillColor('#475569') // Slate 600
            .text('This is to proudly certify that', 0, 200, { align: 'center' });

        // Name
        doc.font('Times-BoldItalic')
            .fontSize(38)
            .fillColor('#0F172A')
            .text(req.user.name.toUpperCase(), 0, 240, { align: 'center' });

        doc.font('Times-Roman')
            .fontSize(18)
            .fillColor('#475569')
            .text('has demonstrated excellence by successfully completing the course:', 0, 310, { align: 'center' });

        // Event Title
        doc.font('Times-Bold')
            .fontSize(26)
            .fillColor('#0F172A')
            .text(`"${event.title.toUpperCase()}"`, 0, 360, { align: 'center' });

        // Date & Location
        const dateString = new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        doc.font('Times-Italic')
            .fontSize(16)
            .fillColor('#64748B')
            .text(`Awarded on this day, ${dateString}, at ${event.location}`, 0, 410, { align: 'center' });
            
        // Signatures
        doc.moveTo(120, 500).lineTo(320, 500).lineWidth(1).strokeColor('#0F172A').stroke();
        doc.font('Times-Roman').fontSize(14).fillColor('#475569').text('Institute Director', 120, 510, { width: 200, align: 'center' });
        
        doc.moveTo(pageWidth - 320, 500).lineTo(pageWidth - 120, 500).lineWidth(1).strokeColor('#0F172A').stroke();
        doc.font('Times-Roman').fontSize(14).text('Event Organizer', pageWidth - 320, 510, { width: 200, align: 'center' });

        // Authentic QR Code Stamp Bottom Center
        doc.image(qrCodeDataUrl, pageWidth / 2 - 35, 460, { width: 70 });
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#94A3B8').text('SCAN TO VERIFY', 0, 540, { align: 'center' });
        
        // Unique ID Display
        const certId = `CERT-${certificate._id.toString().substring(0, 8).toUpperCase()}`;
        doc.font('Helvetica').fontSize(10).fillColor('#64748B').text(`Certificate ID: ${certId}`, 40, pageHeight - 60, { align: 'left' });

        // Finalize PDF file
        doc.end();

    } catch (error) {
        if (!res.headersSent) {
            console.error("Certificate Generation Error:", error);
            res.status(500).json({ message: error.message });
        } else {
            console.error("Error generating PDF after headers sent:", error);
        }
    }
};

module.exports = {
    generateCertificate
};