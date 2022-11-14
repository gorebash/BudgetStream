const express = require('express');
const bodyParser = require('body-parser');
const configuredWebPush = require('./configured-web-push');

//Simple in mem array for POC.
const _subs = [];

const app = express();
const port = process.env.PORT || 4000;

const static = process.env.NODE_ENV === 'production' ? 'dist' : '.';

// Express configuration
app.disable('x-powered-by');

app.use(express.static(static));
app.use(bodyParser.json());

app.get('/api/key', function(req, res) {
    if (configuredWebPush.vapidPublicKey !== '') {
        res.send({
            key: configuredWebPush.vapidPublicKey
        });
    } else {
        res.status(500).send({
            key: 'VAPID KEYS ARE NOT SET'
        });
    }
});

app.post('/api/subscribe', async function(req, res) {
    try {
        const sub = req.body.subscription;

        // Find if user is already subscribed searching by `endpoint`
        const exists = _subs.find(x => x.endpoint == sub.endpoint);

        if (exists) {
            res.status(400).send('Subscription already exists');

            return;
        }
        
        _subs.push(sub);

        res.status(200).send('Success');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/api/unsubscribe', async function(req, res) {
    try {
        const sub = req.body.subscription;

        await Subscription.remove({endpoint: sub.endpoint});
        console.log('Deleted: ' + sub.endpoint);

        res.status(200).send('Success');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/api/notify', async function(req, res) {
    const data = req.body;

    const sendNotification = async function() {
        try {
            await configuredWebPush.webPush.sendNotification(data.subscription, data.payload, { contentEncoding: data.encoding })
                .then(function (response) {
                    console.log('Response: ' + JSON.stringify(response, null, 4));
                    res.status(201).send(response);
                })
                .catch(function (e) {
                    console.log('Error: ' + JSON.stringify(e, null, 4));
                    res.status(201).send(e);
                });
        } catch (e) {
            res.status(500).send(e.message);
        }
    };

    if (data.delay) {
        setTimeout(sendNotification, data.delay);
    } else {
        sendNotification();
    }
});

app.get('/api/notify-demo', function(req, res) {
    try {
        const sub = _subs[0];
         configuredWebPush.webPush.sendNotification(sub, JSON.stringify({title: 'Annoyed yet?', message: 'Hello there!'}), { contentEncoding: 'aes128gcm' })
            .then(function (response) {
                console.log('Response: ' + JSON.stringify(response, null, 4));
                res.status(201).send(response);
            })
            .catch(function (e) {
                console.log('Error: ' + JSON.stringify(e, null, 4));
                res.status(201).send(e);
            });
    } catch (e) {
        res.status(500)
            .send(e.message);
    }
});

app.listen(port, function() {
    console.log(`Server listening on port ${port}`);
});