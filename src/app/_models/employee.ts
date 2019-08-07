import { Position } from './position';
import { Room } from './room';

export class Employee {
    id: number;
    firstName: string;
    lastName: string;
    position: Position;
    room: Room;
    salary: number;
}