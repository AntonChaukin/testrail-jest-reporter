const baseUrl = process.env.URL;
const user = process.env.US;
const pass = process.env.PW;

module.exports = {
    //The server address
    'baseUrl': baseUrl || 'http://localhost',
    //You TestRail username for the API authentication
    'user': user || 'user@example.com',
    //You TestRail password or API key for the API authentication
    'pass': pass || 'some-password',
    //'milestone': '<milestone_name>'
}