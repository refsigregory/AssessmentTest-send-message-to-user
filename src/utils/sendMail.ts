import axios from 'axios';

const endpoint = 'https://email-service.digitalenvision.com.au/';

export default function sendMail({email, message}: {
  email: string,
  message: string,
}) {
  return axios.post(endpoint + 'send-email', {
    email: email,
    message: message
  })
}