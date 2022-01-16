import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";
import { IVacation } from "../Models/IVacation";


export function reduce(oldAppData: AppState = new AppState(), action: Action): AppState {
    const newAppData = { ...oldAppData };

    switch (action.type) {
        case ActionType.OnClickSignIn:

            newAppData.currentUser =
            {
                userType: action.payload.userType,
                userId: action.payload.userId,
                token: action.payload.token
            }
          
            break;

        case ActionType.getAllVacations:
            let myArray = action.payload;
            newAppData.vacationsArray = myArray

            break;


        case ActionType.DeleteVacation:

            newAppData.vacationsArray = [...oldAppData.vacationsArray];
            let deletedVacationId = action.payload.vacationId;
            console.log(deletedVacationId);
            let updatedVacationList = newAppData.vacationsArray
                .filter(vacation => vacation.vacationId != deletedVacationId);
            newAppData.vacationsArray = updatedVacationList;
        

            break;




        case ActionType.EditVacation:

            let changedVacationId = action.payload.vacationId;
            let changedVacationDestination = action.payload.vacationDestination;
            let changedVacationPrice = action.payload.price;
            let changedVacationImg = action.payload.img;
            let changedVacationStartDate = action.payload.startDate;
            let changedVacationEndDate = action.payload.endDate;


            newAppData.vacationsArray = [...oldAppData.vacationsArray];
            newAppData.vacationsArray.forEach((vacation) => {
                if (changedVacationId === vacation.vacationId) {
                    vacation.vacationDestination = changedVacationDestination;
                    vacation.price = changedVacationPrice;
                    vacation.img = changedVacationImg;
                    vacation.startDate = changedVacationStartDate;
                    vacation.endDate = changedVacationEndDate;
                }
            })
            break;


        case ActionType.AddVacation:
            newAppData.vacationsArray = [...oldAppData.vacationsArray];
            let addedVacationDestination = action.payload.vacationDestination;
            let addedVacationPrice = action.payload.price;
            let addedVacationImg = action.payload.img;
            let addedVacationStartDate = action.payload.startDate;
            let addedVacationEndDate = action.payload.endDate;
            let newVacationId = action.payload.vacationId;
            console.log(newVacationId);
            newAppData.vacationsArray.push({
                vacationId: newVacationId, vacationDestination: addedVacationDestination, price: addedVacationPrice
                , img: addedVacationImg, startDate: addedVacationStartDate, endDate: addedVacationEndDate, isFollowed: false
            })


            break;

        case ActionType.ToggleFollowVacation:

            let followedVacationId = action.payload.vacationId;
            let isFollowedVacation = action.payload.isFollowed;
            let vacationsArray: IVacation[] = action.payload.vacationsArray;

            newAppData.vacationsArray.forEach((vacation) => {
                if (followedVacationId === vacation.vacationId) {
                    vacation.isFollowed = isFollowedVacation
                }
            })

            vacationsArray.sort(function (a, b) {
                return (a.isFollowed === b.isFollowed) ? 0 : a.isFollowed ? -1 : 1;
            })

            newAppData.vacationsArray = vacationsArray;
            console.log(newAppData.vacationsArray);
            newAppData.vacationsArray = [...oldAppData.vacationsArray];

            break;


        case ActionType.getAllFollowedVacations:

            let followedVacationsId = action.payload;

            for (let i = 0; i < followedVacationsId.length; i++) {
                let FollowedVacationToBeChecked = followedVacationsId[i];
                FollowedVacationToBeChecked = JSON.stringify(FollowedVacationToBeChecked);
                console.log(FollowedVacationToBeChecked.length);
                if(FollowedVacationToBeChecked.length == 16){
                FollowedVacationToBeChecked = FollowedVacationToBeChecked.slice(14,15)
            }
            else {
                FollowedVacationToBeChecked = FollowedVacationToBeChecked.slice(14,16)
            }
                console.log(FollowedVacationToBeChecked);
                for (let j = 0; j < newAppData.vacationsArray.length; j++) {
                    if (newAppData.vacationsArray[j].vacationId == FollowedVacationToBeChecked) {
                        newAppData.vacationsArray[j].isFollowed = true;
                    }
                }
            }

            newAppData.vacationsArray.sort(function (a, b) {
                return (a.isFollowed === b.isFollowed) ? 0 : a.isFollowed ? -1 : 1;
            })
            console.log(newAppData.vacationsArray);
            newAppData.vacationsArray = [...oldAppData.vacationsArray];

            break;
    }



    return newAppData;
}