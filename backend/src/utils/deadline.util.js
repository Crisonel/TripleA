import { Todo } from '../models/todo.models.js';
import { User } from '../models/user.models.js';
import { sendEmail } from './mail.util.js';
import cron from "node-cron";

const sendDeadlineReminders = async () => {
  try {
    // Calculate date one day from now
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find users with a deadline exactly one day from now
    const deadlines = await Todo.find({
      deadline: {
        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
        $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
      },
    }).select('user title deadline');

    // Send reminder emails to each user
    for (const reminder of deadlines) {
      const subject = 'Reminder: Upcoming Deadline';
      const text = `Hello, this is a reminder that your deadline for ${reminder.title} is tomorrow: ${reminder.deadline}`;

      const recipient = await User.findById(reminder.user);

      const email = recipient.email;
      
      await sendEmail(email, subject, text);
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};

const scheduleReminder = async() => {
    cron.schedule('0 9 * * *', () => {
        console.log("Sending Daily Reminder");
        sendDeadlineReminders();
    });
};

export  {scheduleReminder};

