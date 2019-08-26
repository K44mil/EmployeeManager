import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError, from } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, refCount } from 'rxjs/operators';
import { Position } from '../_models/position';

// import fake-database
import { ROOMS } from '../_database/mock-rooms';
import { POSITIONS } from '../_database/mock-positions';
import { EMPLOYEES } from '../_database/mock-employees';
import { Employee } from '../_models/employee';
import { Room } from '../_models/room';
import { Desk } from '../_models/desk';

// // put data to local storage

// localStorage.setItem('rooms', JSON.stringify(ROOMS));
// localStorage.setItem('positions', JSON.stringify(POSITIONS));
// localStorage.setItem('employees', JSON.stringify(EMPLOYEES));


// // load data from local storage
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
let positions = JSON.parse(localStorage.getItem('positions')) || [];
let desks = JSON.parse(localStorage.getItem('desks')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(0))
            .pipe(dematerialize());

        function handleRoute() {
            switch(true) {
                case url.endsWith('/employees') && method === 'GET':
                    return getEmployees();
                case url.endsWith('/rooms') && method === 'GET':
                    return getRooms();
                case url.endsWith('/positions') && method === 'GET':
                    return getPositions();
                case url.match(/\/desks\/\d+$/) && method === 'GET':
                    return getAllDesksByRoomId();
                case url.match(/\/positions\/\d+$/) && method === 'DELETE':
                    return deletePosition();
                case url.match(/\/rooms\/\d+$/) && method === 'DELETE':
                    return deleteRoom();
                case url.match(/\/employees\/\d+$/) && method === 'DELETE':
                    return deleteEmployee();
                // case url.match(/\/positions\/\d+$/) && method === 'GET':
                //     return getPositionById();
                case url.endsWith('/rooms') && method === 'POST':
                    return addRoom();
                case url.endsWith('/positions') && method === 'POST':
                    return addPosition();
                case url.endsWith('/employees') && method === 'POST':
                    return addEmployee();
                case url.match(/\/rooms\/\d+$/) && method === 'PUT':
                    return editRoom();
                case url.match(/\/positions\/\d+$/) && method === 'PUT':
                    return editPosition();
                case url.match(/\/employees\/\d+$/) && method === 'PUT':
                    return editEmployee();
                case url.match(/\/desks\/\d+$/) && method === 'PUT':
                    return editDesk();
                case url.match(/\/employees\/rmfromroom\/employeeId=\/\d+$/) && method === 'GET':
                    return removeEmployeeFromAnyRoom();
                case url.match(/\/employees\/rmfromdesk\/employeeId=\/\d+$/) && method === 'GET':
                    return removeEmployeeFromPreviousDesk();
                case url.match(/\/employees\/roomid=\/\d+$/) && method === 'PUT':
                    return assignEmployeeToRoom();
                case url.match(/\/info\/\d+$/) && method === 'GET':
                    return info();
                default:
                    console.log('default backend handle route');
                    return next.handle(request);
            }
        }

        // GET functions
        
            // GET ALL functions

        function getEmployees() {
            return ok(employees);
        }

        function getRooms() {
            updateOccupiedPlaces();
            return ok(rooms);
        }

        function getPositions() {
            return ok(positions);
        }

        function getAllDesksByRoomId() {
            const desksInRoom = desks.filter(x => x.roomId === idFromUrl());
            return ok(desksInRoom);
        }

            // GET BY ID functions
            // --TODO--

        // function getPositionById() {
        //     const position = positions.filter(x => x.id === idFromUrl());
        //     return ok(position);
        // }

        // DELETE functions

        function deletePosition() {
            let positionToDelete = positions.filter(x => x.id === idFromUrl())[0];

            let nullPosition: Position = {
                id: -1,
                name: '-',
                minWage: 0,
                maxWage: 0
            }

            employees.forEach(e => {
                if (e.position.id === positionToDelete.id) {
                    e.position = nullPosition;
                    e.salary = 0;
                }
            });
            localStorage.setItem('employees', JSON.stringify(employees));
            positions = positions.filter(x => x.id !== idFromUrl());
            localStorage.setItem('positions', JSON.stringify(positions));
            return ok();
        }

        function deleteRoom() {
            let roomToDelete = rooms.filter(x => x.id === idFromUrl())[0];
            removeEmployeesFromRoom();
            // delete desks in room
            desks = desks.filter(x => x.roomId !== roomToDelete.id);
            localStorage.setItem('desks', JSON.stringify(desks));

            rooms = rooms.filter(x => x.id !== idFromUrl());
            localStorage.setItem('rooms', JSON.stringify(rooms));
            return ok();
        }

        function deleteEmployee() {
            employees = employees.filter(x => x.id !== idFromUrl());
            localStorage.setItem('employees', JSON.stringify(employees));
            return ok();
        }

        // POST functions

        function addRoom() {
            const room = body.roomObj;
            const desksInRoom: Desk[] = body.desksInRoom;

            room.id = rooms.length ? Math.max(...rooms.map(x => x.id)) + 1 : 1;
            room.occupiedPlaces = 0;

            desksInRoom.forEach(desk => {
                desk.id = desks.length ? Math.max(...desks.map(x => x.id)) + 1 : 1;
                desk.roomId = room.id;
                desks.push(desk);
            });

            rooms.push(room);
            localStorage.setItem('desks', JSON.stringify(desks));
            localStorage.setItem('rooms', JSON.stringify(rooms));
            return ok();
        }

        function addPosition() {
            const position = body;

            position.id = positions.length ? Math.max(...positions.map(x => x.id)) + 1 : 1;
            positions.push(position);
            localStorage.setItem('positions', JSON.stringify(positions));

            return ok();
        }

        function addEmployee() {
            const employee = body;

            employee.id = employees.length ? Math.max(...employees.map(x => x.id)) +1 : 1;
            employees.push(employee);
            localStorage.setItem('employees', JSON.stringify(employees));

            return ok();
        }

        // PUT functions

        function editRoom() {
            const room = body.roomObj;
            const desksInRoom: Desk[] = body.desksInRoom;

            // delete all previous desks in room
            desks = desks.filter(desk => desk.roomId !== idFromUrl());
            // remove employees from room
            removeEmployeesFromRoom();

            desksInRoom.forEach(desk => {
                desk.id = desks.length ? Math.max(...desks.map(x => x.id)) + 1 : 1;
                desk.roomId = idFromUrl();
                desks.push(desk);
            });
            
            rooms.forEach(r => {
                if (r.id === idFromUrl()) {
                    r.number = room.number;
                    r.name = room.name;
                    r.width = room.width;
                    r.height = room.height;
                    r.capacity = room.capacity;
                }
            });

            localStorage.setItem('desks', JSON.stringify(desks));
            localStorage.setItem('rooms', JSON.stringify(rooms));

            return ok();
        }

        function editPosition() {
            const position = body;

            positions.forEach(p => {
                if (p.id === idFromUrl()) {
                    p.name = position.name;
                    p.minWage = position.minWage;
                    p.maxWage = position.maxWage;
                }
            });

            localStorage.setItem('positions', JSON.stringify(positions));

            return ok();
        }

        function editEmployee() {
            const employee = body;

            employees.forEach(e => {
                if (e.id === idFromUrl()) {
                    e.firstName = employee.firstName;
                    e.lastName = employee.lastName;
                    e.room = employee.room;
                    e.position = employee.position;
                    e.salary = employee.salary;
                }
            });

            localStorage.setItem('employees', JSON.stringify(employees));

            return ok();
        }

        function assignEmployeeToRoom() {
            const employee = body;
            const room = rooms.filter(room => room.id === idFromUrl())[0];

            employees.forEach(e => {
                if (e.id === employee.id) {
                    e.room = room;
                }
            });

            rooms.forEach(r => {
                if (r.id === idFromUrl()) {
                    r.occupiedPlaces++;
                }
            });

            localStorage.setItem('rooms', JSON.stringify(rooms));
            localStorage.setItem('employees', JSON.stringify(employees));
            
            return ok();
        }

        function editDesk() {
            const desk = body;

            desks.forEach(d => {
                if (d.id === idFromUrl()) {
                    d.employeeId = desk.employeeId;
                }
            });

            localStorage.setItem('desks', JSON.stringify(desks));

            return ok();
        }

        function removeEmployeeFromAnyRoom() {

            let nullRoom: Room = {
                id: -1,
                number: '-',
                name: '-',
                height: 1000,
                width: 1000,
                capacity: 1000,
                occupiedPlaces: 0
            };

            employees.forEach(e => {
                if (e.id === idFromUrl()) {
                    e.room = nullRoom;
                }
            });

            localStorage.setItem('desks', JSON.stringify(desks));
            localStorage.setItem('employees', JSON.stringify(employees));

            return ok();
        }

        function removeEmployeeFromPreviousDesk() {

            desks.forEach(d => {
                if (d.employeeId === idFromUrl()) {
                    d.employeeId = -1;
                }
            });

            localStorage.setItem('desks', JSON.stringify(desks));
    
            return ok();
        }

        function info() {

            let allPositions = [];
            let employeePerPos = [];

            employees.forEach(e => {
                if(e.room.id === idFromUrl() && !allPositions.includes(e.position.name)) {
                    allPositions.push(e.position.name);
                }
            });

            for(let i = 0; i < allPositions.length; i++) {
                employeePerPos.push(0);
            }

            for(let i = 0; i < allPositions.length; i++) {
                for(let j = 0; j < employees.length; j++) {
                    if(employees[j].position.name === allPositions[i] && employees[j].room.id === idFromUrl()) {
                        employeePerPos[i]++;
                    }
                }
            }

            let sum:number = 0;  

            employeePerPos.forEach(e => {
                sum += Number.parseInt(e);
            });


            let room: Room = rooms.filter(r => r.id === idFromUrl())[0];

            let freeSpace;

            if (sum < room.capacity) {
                freeSpace = room.capacity - sum;

                allPositions.push('Free places');
                employeePerPos.push(freeSpace);
            }

            let employeesBySalary = employees.sort(sortBySalaryASC);

            let bestPaidEmployee = employeesBySalary[employeesBySalary.length - 1];
            let worstPaidEmployee = employeesBySalary[0];

            let avgSalary = 0;
            let sumSalary = 0;

            employees.forEach(e => {
                sumSalary += Number.parseInt(e.salary);
            });

            avgSalary = sumSalary / employees.length;
            
            // --- Average salary per position

            let avgAllPosNames = [];
            let avgSalaryPerPos = [];
            let sumSalaryPerPos = [];
            let employeesPerPos = [];

            employees.forEach(e => {
                if(!avgAllPosNames.includes(e.position.name)) {
                    avgAllPosNames.push(e.position.name);
                }
            });

            positions.forEach(() => {
                avgSalaryPerPos.push(0);
                sumSalaryPerPos.push(0);
                employeesPerPos.push(0);
            });

            for(let i = 0; i < avgAllPosNames.length; i++) {

                let sumPos = 0;
                let coutEmployees = 0;

                for(let j = 0; j < employees.length; j++) {
                    if(avgAllPosNames[i] === employees[j].position.name) {
                        sumPos += Number.parseInt(employees[j].salary);
                        coutEmployees++;
                    }
                }

                if (coutEmployees !== 0) {
                    avgSalaryPerPos[i] = sumPos/coutEmployees;
                    sumSalaryPerPos[i] = sumPos;
                }
            
            }

            // count employees per position

            for(let i = 0; i < avgAllPosNames.length; i++) {
                for(let j = 0; j < employees.length; j++) {
                    if (avgAllPosNames[i] === employees[j].position.name) {
                        employeesPerPos[i]++;
                    }
                }
            }


            let infoObj = {
                employeesNumber: employees.length,
                positionsPerRoomL: allPositions,
                positionsPerRoomD: employeePerPos,
                bestPaidEmployee: bestPaidEmployee,
                worstPaidEmployee: worstPaidEmployee,
                avgSalary: avgSalary,
                sumSalary: sumSalary,
                avgSalaryPerPositionL: avgAllPosNames,
                avgSalaryPerPositionD: avgSalaryPerPos,
                sumSalaryPerPositionD: sumSalaryPerPos,
                employeesPerPos: employeesPerPos
            }

            return ok(infoObj);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function updateOccupiedPlaces() {
            // console.log('Hello - updateOccupiedPlaces function');
            
            rooms.forEach(room => {
                room.occupiedPlaces = 0;
            });

            rooms.forEach(room => {
                employees.forEach(employee => {
                    if (employee.room.id === room.id) {
                        room.occupiedPlaces = room.occupiedPlaces + 1;
                    }
                });
            });
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }

        function sortBySalaryASC(e1, e2) {
            return ((e1.salary == e2.salary) ? 0 : ((e1.salary > e2.salary) ? 1 : -1 ));
        } 
        
        function removeEmployeesFromRoom() {
            let roomToDelete = rooms.filter(x => x.id === idFromUrl())[0];

            let nullRoom: Room = {
                id: -1,
                number: '-',
                name: '-',
                height: 1000,
                width: 1000,
                capacity: 1000,
                occupiedPlaces: 0
            };

            employees.forEach(e => {
                if (e.room.id === roomToDelete.id) {
                    e.room = nullRoom;
                }
            });
            localStorage.setItem('employees', JSON.stringify(employees));
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}