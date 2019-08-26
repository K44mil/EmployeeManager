import { Desk } from '../_models/desk';

export const DESKS: Desk[] = [
    {
        id: 1,
        height: 70,
        width: 150,
        positionX: 25,
        positionY: 25,
        direction: 2,
        collide: 0,
        employeeId: 1,
        roomId: 10
    },
    {
        id: 2,
        height: 70,
        width: 150,
        positionX: 225,
        positionY: 25,
        direction: 2,
        collide: 0,
        employeeId: 2,
        roomId: 10
    },
    {
        id: 3,
        height: 70,
        width: 150,
        positionX: 25,
        positionY: 225,
        direction: 2,
        collide: 0,
        employeeId: -1,
        roomId: 10
    },
    {
        id: 4,
        height: 70,
        width: 150,
        positionX: 225,
        positionY: 225,
        direction: 2,
        collide: 0,
        employeeId: -1,
        roomId: 10
    },
];

