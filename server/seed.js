const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Certificate = require('./models/Certificate');

// Use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Check for --drop flag
        if (process.argv.includes('--drop')) {
            console.log('⚠️  Dropping existing data...');
            await User.deleteMany({});
            await Event.deleteMany({});
            await Registration.deleteMany({});
            await Certificate.deleteMany({});
            console.log('✅ All collections cleared.');
        }

        // Check if data already exists
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0 && !process.argv.includes('--drop')) {
            console.log(`Database already has ${existingUsers} users. Use --drop to reset.`);
            process.exit(0);
        }

        // ─── Create Users ───
        console.log('\n📦 Creating users...');

        const admin = await User.create({
            name: 'Dr. Rajesh Kumar',
            email: 'admin@smartcollege.edu',
            password: 'admin123',
            role: 'admin',
        });
        console.log(`  ✅ Admin: ${admin.email} (password: admin123)`);

        const organizer1 = await User.create({
            name: 'Prof. Ananya Sharma',
            email: 'ananya@smartcollege.edu',
            password: 'organizer123',
            role: 'organizer',
        });

        const organizer2 = await User.create({
            name: 'Dr. Vikram Mehta',
            email: 'vikram@smartcollege.edu',
            password: 'organizer123',
            role: 'organizer',
        });

        // Approve seeded organizers for demo purposes
        await User.findByIdAndUpdate(organizer1._id, { isApproved: true });
        await User.findByIdAndUpdate(organizer2._id, { isApproved: true });
        console.log(`  ✅ Organizers: ${organizer1.email}, ${organizer2.email} (password: organizer123) — Auto-approved`);

        const students = await User.create([
            { name: 'Aman Qureshi', email: 'aman@student.edu', password: 'student123', role: 'student' },
            { name: 'Priya Patel', email: 'priya@student.edu', password: 'student123', role: 'student' },
            { name: 'Rohit Singh', email: 'rohit@student.edu', password: 'student123', role: 'student' },
            { name: 'Fatima Khan', email: 'fatima@student.edu', password: 'student123', role: 'student' },
            { name: 'Arjun Nair', email: 'arjun@student.edu', password: 'student123', role: 'student' },
        ]);
        console.log(`  ✅ Students: ${students.map(s => s.email).join(', ')} (password: student123)`);

        // ─── Create Events ───
        console.log('\n📦 Creating events...');

        const now = new Date();
        const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        const events = await Event.create([
            {
                title: 'Annual Tech Symposium 2026',
                description: 'Join us for the biggest technology symposium of the year! Featuring keynote speakers from Google, Microsoft, and Amazon. Workshops on AI/ML, Cloud Computing, and Cybersecurity. Three days of innovation, networking, and hands-on learning experiences that will shape your career.\n\nHighlights:\n• Keynote by industry experts\n• Hands-on workshops\n• Project showcase competition\n• Networking dinner\n• Certificate of participation',
                date: daysFromNow(7),
                time: '09:00',
                location: 'Main Auditorium, Block A',
                organizer: organizer1._id,
                status: 'approved',
            },
            {
                title: 'Cultural Fest — Harmony 2026',
                description: 'The most awaited cultural extravaganza of the semester! Music, dance, drama, art exhibitions, and food stalls from across the country. Participate in competitions or simply enjoy the performances.\n\nEvents include:\n• Classical & Western music competitions\n• Group dance showdown\n• One-act play competition\n• Art & Photography exhibition\n• Food court with 20+ stalls',
                date: daysFromNow(14),
                time: '10:00',
                location: 'Open Air Theatre & Campus Ground',
                organizer: organizer2._id,
                status: 'approved',
            },
            {
                title: 'Hackathon: Code for Change',
                description: '24-hour coding marathon to build solutions for real-world problems! Form teams of 2-4 and compete for prizes worth ₹50,000. Mentors from top startups will guide you through the night. Pizza, coffee, and energy drinks provided!\n\nThemes:\n• Healthcare & Wellness\n• Education Technology\n• Sustainable Development\n• Smart City Solutions',
                date: daysFromNow(21),
                time: '18:00',
                location: 'Computer Science Lab, Block C',
                organizer: organizer1._id,
                status: 'approved',
            },
            {
                title: 'Workshop: Introduction to Machine Learning',
                description: 'A beginner-friendly workshop covering the fundamentals of Machine Learning with Python. Learn about supervised learning, neural networks, and build your first ML model. Laptops required.\n\nPrerequisites: Basic Python knowledge\nDuration: 4 hours\nInstructor: Prof. Ananya Sharma',
                date: daysFromNow(3),
                time: '14:00',
                location: 'Seminar Hall 2, Block B',
                organizer: organizer1._id,
                status: 'approved',
            },
            {
                title: 'Inter-College Sports Meet 2026',
                description: 'Annual inter-college sports competition featuring Athletics, Basketball, Football, Cricket, and Badminton. Represent your department and bring home the trophy!\n\nRegistration is open for individual and team events.\n\nVenues: College Gymnasium, Sports Ground, Indoor Courts',
                date: daysFromNow(30),
                time: '07:00',
                location: 'Sports Complex',
                organizer: organizer2._id,
                status: 'pending',
            },
            {
                title: 'Guest Lecture: Future of Quantum Computing',
                description: 'Distinguished lecture by Dr. Priya Natarajan from IISc Bangalore on the latest advancements in Quantum Computing and its implications for the tech industry.\n\nOpen to all departments. Refreshments will be served.',
                date: daysFromNow(5),
                time: '11:00',
                location: 'Conference Room, Administrative Block',
                organizer: organizer2._id,
                status: 'pending',
            },
        ]);
        console.log(`  ✅ Created ${events.length} events (4 approved, 2 pending)`);

        // ─── Create Registrations ───
        console.log('\n📦 Creating sample registrations...');

        const approvedEvents = events.filter(e => e.status === 'approved');
        let regCount = 0;
        let attendCount = 0;

        for (const event of approvedEvents) {
            // Register random students for each approved event
            const shuffled = [...students].sort(() => 0.5 - Math.random());
            const toRegister = shuffled.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 students

            for (const student of toRegister) {
                const qrCodeData = `${student._id}-${event._id}-${Date.now() + Math.random() * 1000}`;
                const isAttended = Math.random() > 0.4; // 60% chance of attendance

                await Registration.create({
                    user: student._id,
                    event: event._id,
                    qrCodeData,
                    status: isAttended ? 'attended' : 'registered',
                    ...(isAttended && Math.random() > 0.5 ? {
                        feedback: {
                            rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
                            comment: [
                                'Great event! Very well organized.',
                                'Learned a lot from this experience.',
                                'Amazing speakers and great content.',
                                'Would definitely attend again!',
                                'Good event, could improve the food options.',
                            ][Math.floor(Math.random() * 5)]
                        }
                    } : {})
                });
                regCount++;
                if (isAttended) attendCount++;
            }
        }
        console.log(`  ✅ Created ${regCount} registrations (${attendCount} attended)`);

        // ─── Summary ───
        console.log('\n' + '═'.repeat(50));
        console.log('🎉 Seed completed successfully!');
        console.log('═'.repeat(50));
        console.log('\nLogin Credentials:');
        console.log('─'.repeat(40));
        console.log('Admin:     admin@smartcollege.edu / admin123');
        console.log('Organizer: ananya@smartcollege.edu / organizer123');
        console.log('Organizer: vikram@smartcollege.edu / organizer123');
        console.log('Student:   aman@student.edu / student123');
        console.log('Student:   priya@student.edu / student123');
        console.log('─'.repeat(40));

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedData();
