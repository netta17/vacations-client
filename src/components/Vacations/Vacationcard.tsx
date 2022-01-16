
import moment from "moment";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { IVacation } from "../../Models/IVacation";
import { AppState } from "../../redux/app-state";
import DeleteVacation from "../DeleteVacation/DeleteVacation";
import EditVacationModal from "../EditVacationModal/EditVacationModal";
import FollowersForEachVacation from "../FollowersForEachVacation/FollowersForEachVacation";
import FollowVacation from "../FollowVacation/FollowVacation";
import "./Vacationcard.css";





export default function Vacationcard(props: IVacation) {

  const currentUser = useSelector((state: AppState) => state.currentUser);

  let startDate = props.startDate;
  let newStartDate = moment(startDate).format('DD-MM-YYYY');

  let endDate = props.endDate;
  let newEndDate = moment(endDate).format('DD-MM-YYYY');

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img src={props.img} />
      <Card.Body>

        <Card.Title>{props.vacationDestination}</Card.Title>
        <Card.Subtitle>{props.price + "₪"}</Card.Subtitle>
        <Card.Subtitle>{newStartDate + " - " + newEndDate} </Card.Subtitle>

        {currentUser.userType === "admin" &&
          <EditVacationModal price={props.price} vacationDestination={props.vacationDestination} img={props.img} startDate={props.startDate} endDate={props.endDate} vacationId={props.vacationId} isFollowed={props.isFollowed} />
        }
        {currentUser.userType === "admin" &&
          <DeleteVacation price={props.price} vacationDestination={props.vacationDestination} img={props.img} startDate={newStartDate} endDate={newEndDate} vacationId={props.vacationId} isFollowed={props.isFollowed} />
        }

        {currentUser.userType === "customer" &&
          <FollowersForEachVacation price={props.price} vacationDestination={props.vacationDestination} img={props.img} startDate={newStartDate} endDate={newEndDate} vacationId={props.vacationId} isFollowed={props.isFollowed} />
        }
        {currentUser.userType === "customer" &&
          <FollowVacation price={props.price} vacationDestination={props.vacationDestination} img={props.img} startDate={newStartDate} endDate={newEndDate} vacationId={props.vacationId} isFollowed={props.isFollowed} />
        }
      </Card.Body>
    </Card>
  )
}


