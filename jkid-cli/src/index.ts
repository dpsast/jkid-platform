import axios from "axios";
import commandLineArgs from "command-line-args";

const optionDefinitions = [
  {name: 'list', type: Boolean},
  {name: 'accept', type: Number},
  {name: 'reject', type: Number}
];

const options = commandLineArgs(optionDefinitions);

const apiBaseURL = `http://localhost:${process.env.BACKEND_PORT || '14590'}/api/admin`;

async function main() {
  if (options.list) {
    try {
      const response = await axios.get(`${apiBaseURL}/list`);
      console.log((response.data as any[]).map(
        value => [
          `Name: ${value.name}`,
          `Email: ${value.email}`,
          `Student ID: ${value.studentId}`,
          `Department: ${value.department}`,
          `Reason: ${value.reason}`,
        ].join('\n')
      ).join('\n\n'));
    } catch (error) {
      console.error('Error fetching the list:', error);
    }
  } else if (options.accept !== undefined) {
    try {
      const response = await axios.get(`${apiBaseURL}/accept`, {params: {id: options.accept}});
      console.log(response.data);
    } catch (error) {
      console.error('Error accepting the user:', error);
    }
  } else if (options.reject !== undefined) {
    try {
      const response = await axios.get(`${apiBaseURL}/reject`, {params: {id: options.reject}});
      console.log(response.data);
    } catch (error) {
      console.error('Error rejecting the user:', error);
    }
  } else {
    console.log('No valid command provided. Use --list, --accept <id>, or --reject <id>.');
  }
}

main();