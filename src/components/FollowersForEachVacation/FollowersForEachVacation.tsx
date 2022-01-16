
import axios from 'axios';
import { useState } from 'react';
import { IVacation } from '../../Models/IVacation';
import './FollowersForEachVacation.css';

export default function FollowersForEachVacation(props: IVacation) {


  let [numberOfFollowers, setNumberOfFollowers] = useState("");


  try {
    axios.get(`http://34.65.97.206:3001/followedVacations/${props.vacationId}`)
      .then((reponse) => {
        setNumberOfFollowers(reponse.data[0].followers);

      }
      )
  }

  catch (error) {
    console.log(error)
  }

  return (

    <p> {numberOfFollowers} Follows this vacation</p>
  );
}
