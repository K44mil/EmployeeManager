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
        position: positions[0],
        room: rooms[0],
        salary: 400
    }
]
