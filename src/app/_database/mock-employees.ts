import { ROOMS } from './mock-rooms';
import { POSITIONS } from './mock-positions';

import { Position } from '../_models/position';
import { Room } from '../_models/room';
import { Employee } from '../_models/employee';

const rooms: Room[] = ROOMS;
const positions: Position[] = POSITIONS;

export const EMPLOYEES: Employee[] = [
    {
        id: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        position: positions[4],
        room: rooms[9],
        salary: 13000
    },
    {
        id: 2,
        firstName: 'Hanna',
        lastName: 'Kowalska',
        position: positions[2],
        room: rooms[9],
        salary: 1000
    },
    {
        id: 3,
        firstName: 'Mariusz',
        lastName: 'Mickiewicz',
        position: positions[0],
        room: rooms[0],
        salary: 1600
    },
    {
        id: 4,
        firstName: 'Bartosz',
        lastName: 'Nowak',
        position: positions[3],
        room: rooms[4],
        salary: 1300
    },
    {
        id: 5,
        firstName: 'Franciszek',
        lastName: 'Bak',
        position: positions[5],
        room: rooms[5],
        salary: 2000
    }
];
