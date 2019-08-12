import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError, from } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, refCount } from 'rxjs/operators';

// import fake-database
import { ROOMS } from '../_database/mock-rooms';
import { POSITIONS } from '../_database/mock-positions';
import { EMPLOYEES } from '../_database/mock-employees';
import { EditEmployeeComponent } from '../_components/edit-employee/edit-employee.component';
import { Employee } from '../_models/employee';

// // put data to local storage

// localStorage.setItem('rooms', JSON.stringify(ROOMS));
// localStorage.setItem('positions', JSON.stringify(POSITIONS));
// localStorage.setItem('employees', JSON.stringify(EMPLOYEES));


// // load data from local storage
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
let positions = JSON.parse(localStorage.getItem('positions')) || [];

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
                default:
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

            // GET BY ID functions
            // --TODO--
        
        // function getPositionById() {
        //     const position = positions.filter(x => x.id === idFromUrl());
        //     return ok(position);
        // }

        // DELETE functions

        function deletePosition() {
            positions = positions.filter(x => x.id !== idFromUrl());
            localStorage.setItem('positions', JSON.stringify(positions));
            return ok();
        }

        function deleteRoom() {
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
            const room = body;

            room.id = rooms.length ? Math.max(...rooms.map(x => x.id)) + 1 : 1;
            room.occupiedPlaces = 0;
            rooms.push(room);
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
            const room = body;
            
            rooms.forEach(r => {
                if (r.id === idFromUrl()) {
                    r.number = room.number;
                    r.name = room.name;
                    r.capacity = room.capacity;
                }
            });

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
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}