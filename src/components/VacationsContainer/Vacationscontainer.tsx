import { Key, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import Vacations from "../Vacations/Vacationcard";
import "./Vacationscontainer.css";
import AddVacationModal from "../AddVacationModal/AddVacationModal";
import { ActionType } from "../../redux/action-type";
import axios from "axios";


export default function Vacationscontainer() {

    const vacationsArray = useSelector((state: AppState) => state.vacationsArray);
    const currentUser = useSelector((state: AppState) => state.currentUser);

    let dispatch = useDispatch();
    let userDetailsFromStorage = JSON.parse(sessionStorage.getItem('savedUserDetails'));


    const getAllVacations = () => {
        try {
            axios.get("http://34.65.97.206:3001/vacations")
                .then((response) => {
                    let myVacations = response.data
                    dispatch({ type: ActionType.getAllVacations, payload: myVacations })
                })


            if (userDetailsFromStorage) {
                axios.get("http://34.65.97.206:3001/followedVacations")
                    .then((response) => {
                        let followedVacationsId = response.data
                        dispatch({ type: ActionType.getAllFollowedVacations, payload: followedVacationsId })
                    })
            }
        }

        catch (e) {
            alert("failed getting data")
        }
    }

    useEffect(() => getAllVacations(), [])

    return (
        <><>

        </><div className="vacations-container">

                {currentUser.userType == "admin" &&
                    <AddVacationModal />}

                {vacationsArray.map((vacation: { vacationDestination: string; price: number; img: string; startDate: string; endDate: string; vacationId: number; isFollowed: boolean; }, index: Key | null | undefined) => (
                    <Vacations key={index} vacationDestination={vacation.vacationDestination} price={vacation.price} img={vacation.img} startDate={vacation.startDate} endDate={vacation.endDate}
                        vacationId={vacation.vacationId} isFollowed={vacation.isFollowed} />
                ))}
            </div></>
    )
}

