const { renderTemplate, prepareTestResults } = require('./utils');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('templates', () => {
    beforeAll(async () => {
        await prepareTestResults();
    });

    it('renders sign_up_confirmation', async () => {
        const results = await renderTemplate("sign_up_confirmation", "sign_up_confirmation", {
            "preferred_name": "Lily Wintheiser",
            "contact_email": "lily@example.com",
            "contact_hours": "8.00am-8.00pm Monday to Wednesday and 8.30am-5.00pm Thursday to Sunday",
            "contact_phone_numbers": "0800 435 425",
            "message_date": "23 August 2018",
            "payment_type": "credit_card",
            "property_address": "Suite 762/7321 Braun Falls, North Rae, New York 6012",
            "global_default_signoff": "The team at Flick HQ",
            "global_default_signoff_plain_text": "The team at Flick HQ"
        });

        expect(results.desktop).toMatchImageSnapshot();
        expect(results.mobile).toMatchImageSnapshot();
    });
})