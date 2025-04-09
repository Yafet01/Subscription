import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import Subscription from '../Models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 4, 2, 1]; // Days before renewal to send reminders

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);
    if (!subscription || subscription.status !== "Active") return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date for subscription ${subscriptionId} has passed. Stopping workflow`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
            await triggerReminder(context, `Reminder ${daysBefore} days befor reminder`, subscription);
        } else {
            console.log(`Skipping ${daysBefore} day reminder as the date has passed`);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date.format('YYYY-MM-DD HH:mm:ss')}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    });
};