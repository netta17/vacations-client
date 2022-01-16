import axios, { AxiosResponse } from 'axios';
import { Bar } from 'react-chartjs-2';

let amountOfFollowersPerVacation = []

const data = {
    labels: [],
    datasets: [
        {
            label: '# of followers',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

const options = {
    responsive: true

};

axios.get<never, AxiosResponse<any>>("http://34.65.97.206:3001/followedVacations/reports")

    .then((response) => {
        amountOfFollowersPerVacation = response.data;
        amountOfFollowersPerVacation.forEach((destination) => {
            data.labels.push(destination.vacationDestination)
            data.datasets[0].data.push(destination.amount_of_followers)
        })
    })
    .catch((error: any) =>
       console.log(`${error.response.data.error}`)
      
    )


const Grahps = () => (

    <>
        <Bar data={data} options={options} />
    </>
);

export default Grahps
