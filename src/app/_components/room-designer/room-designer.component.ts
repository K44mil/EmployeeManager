import { Component, OnInit, HostListener, Input, OnChanges, AfterViewInit, Output, EventEmitter, ɵConsole } from '@angular/core';
import { Desk } from 'src/app/_models/desk';

@Component({
  selector: 'app-room-designer',
  templateUrl: './room-designer.component.html',
  styleUrls: ['./room-designer.component.scss']
})
export class RoomDesignerComponent implements OnInit, OnChanges {

  // selected desk properties
  selectedDesk: Desk = null;
  selectedDeskElement: SVGElement = null;
  selectedDeskPoint: SVGPoint = { x: 0, y: 0} as any;

  // all desks in room
  desks: Desk[] = [];

  // employee space properties
  spaceWidth = 200;
  spaceHeight = 200;

  // room properites
  @Input() roomHeight: any;
  @Input() roomWidth: any;
  @Input() numberOfDesks: number;

  // -- svg max size
  svgMaxWidth = 400;
  svgMaxHeight = 400;
  // -- svg actual scaled size
  svgWidth: number;
  svgHeight: number;

  // SVG viewBox properties
  viewBox: string;

  //
  isColliding = false;
  @Output() collidingEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {    
  }

  ngOnChanges() {
    this.resetRoom();
    // console.log('designer changes');
    // console.log('rH: ' + this.roomHeight + '\nrW: ' + this.roomWidth + 'desks: ' + this.numberOfDesks);
    this.viewBox = '0 0 ' + this.roomWidth.toString() + ' ' + this.roomHeight.toString();
    this.setSvgScaledSize();
    this.detectCollisionsAndEmit();
  }

  setSvgScaledSize() {
    this.roomHeight = Number.parseInt(this.roomHeight, 10);
    this.roomWidth = Number.parseInt(this.roomWidth, 10);

    if (this.roomHeight === this.roomWidth) {
      this.svgHeight = this.svgMaxHeight;
      this.svgWidth = this.svgMaxWidth;
    } else {
      if (this.roomHeight > this.roomWidth) {
        this.svgHeight = this.svgMaxHeight;
        this.svgWidth = Math.round((this.roomWidth / this.roomHeight) * this.svgMaxWidth);
      } else {
        this.svgWidth = this.svgMaxWidth;
        this.svgHeight = Math.round((this.roomHeight / this.roomWidth) * this.svgMaxHeight);
      }
    }
  }

  onSvgMouseLeave(e: MouseEvent) {
    this.correctDesksPositions();
    this.detectCollisionsAndEmit();
  }

  detectCollisionsAndEmit() {
    this.isColliding = this.detectCollisions();
    
    const designerInfo = {
      isColliding: this.isColliding,
      numberOfDesksLeft: this.numberOfDesks
    }

    this.collidingEvent.emit(designerInfo);
    // console.log(this.isColliding);
  }

  onSvgMouseUp(e: MouseEvent) {

      const svgElement = e.target as SVGElement;
      let svgSvgElement = e.target as SVGSVGElement;

      if (!(svgElement instanceof SVGSVGElement)) {
        svgSvgElement = svgElement.ownerSVGElement;
      }

      let point = svgSvgElement.createSVGPoint();

      point.x = e.clientX;
      point.y = e.clientY;

      point = point.matrixTransform(svgSvgElement.getScreenCTM().inverse());

      this.selectedDesk = null;
      this.selectedDeskElement = null;

      // console.log('--------------------SVG POINT--------------------');
      // console.log('%cSelected desk: ' + this.selectedDesk, 'color: blue; font-weight: bold');
      // console.log('%cCORDS: ' + '\nX: ' + point.x + '\nY: ' + point.y, 'color: blue; font-weight: 900;');
  }

  onSvgMouseMove(e: MouseEvent) {
    if (this.selectedDesk) {
      const svgElement = e.target as SVGElement;
      let svgSvgElement = e.target as SVGSVGElement;

      if (!(svgElement instanceof SVGSVGElement)) {
        svgSvgElement = svgElement.ownerSVGElement;
      }

      let point = svgSvgElement.createSVGPoint();
      let selectedDeskBorders = svgSvgElement.createSVGPoint();

      // set coords of cords
      point.x = e.clientX;
      point.y = e.clientY;

      // set coords of space rect
      selectedDeskBorders.x = this.selectedDeskElement.getBoundingClientRect().left;
      selectedDeskBorders.y = this.selectedDeskElement.getBoundingClientRect().top;

      // scale coords to svg
      point = point.matrixTransform(svgSvgElement.getScreenCTM().inverse());
      selectedDeskBorders = selectedDeskBorders.matrixTransform(svgSvgElement.getScreenCTM().inverse());

      // set selected desk position
      this.selectedDesk.positionX = Math.floor(point.x - this.selectedDeskPoint.x);
      this.selectedDesk.positionY = Math.floor(point.y - this.selectedDeskPoint.y);

      // correct position if out of the svg
      this.correctDesksPositions();
      // detect collision
      this.detectCollisionsAndEmit();
      // // print space rect borders coords
      // console.log('-----------------------RECT BORDERS-----------------------------------');
      // console.log('%cSelected desk: ' + this.selectedDesk, 'color: red; font-weight: bold');
      // console.log('%cCORDS: ' + '\nLeft: ' + selectedDeskBorders.x
                    //  + '\nTop: ' + selectedDeskBorders.y + '\nRight: ' + (selectedDeskBorders.x + this.selectedDesk.width)
                    //  + '\nBottom: ' + (selectedDeskBorders.y + this.selectedDesk.height), 'color: red; font-weight: 900;');
    }
  }

  onRectMouseDown(e: MouseEvent, clickedDesk: Desk) {
    this.selectedDesk = this.desks.filter(x => x.id === clickedDesk.id)[0]; // get selected desk
    const svgElement = e.target as SVGElement;
    let svgSvgElement = e.target as SVGSVGElement;

    if (!(svgElement instanceof SVGSVGElement)) {
      svgSvgElement = svgElement.ownerSVGElement;
    }
    const rect = svgElement.getBoundingClientRect();

    let selectedDeskBorders = svgSvgElement.createSVGPoint();
    let point = svgSvgElement.createSVGPoint();

    selectedDeskBorders.x = rect.left;
    selectedDeskBorders.y = rect.top;

    point.x = e.clientX;
    point.y = e.clientY;

    selectedDeskBorders = selectedDeskBorders.matrixTransform(svgSvgElement.getScreenCTM().inverse());
    point = point.matrixTransform(svgSvgElement.getScreenCTM().inverse());

    this.selectedDeskPoint.x = Math.floor(point.x - selectedDeskBorders.x - 25); // 25 because of space
    this.selectedDeskPoint.y = Math.floor(point.y - selectedDeskBorders.y - 25);

    this.selectedDeskElement = svgElement;

    // console.log('--------------------------RECT POINT---------------------------');
    // console.log('%cSelected desk: ' + this.selectedDesk, 'color: green; font-weight: bold');
    // console.log('%cCORDS: ' + '\nX: ' + point.x + '\nY: ' + point.y, 'color: green; font-weight: 900;');
  }

  // helper functions
  correctDesksPositions(): void {
    this.desks.forEach(desk => {

      const sideSpace = (this.spaceWidth - desk.width)/2;
      const topSpace = sideSpace;
      const bottomSpace = this.spaceHeight - (topSpace + desk.height);

      if (desk.positionX - sideSpace < 0) {  // correct left space border after leave svg
        desk.positionX = sideSpace;
      }
      if (desk.positionX + desk.width + sideSpace > this.roomWidth) { // correct right space
        desk.positionX = this.roomWidth - desk.width - sideSpace;
      }
      if (desk.positionY - topSpace < 0) { // correct top
        desk.positionY = topSpace;
      }
      if (desk.positionY + desk.height + bottomSpace > this.roomHeight) { // correct bottom
        desk.positionY = this.roomHeight - desk.height - bottomSpace;
      }
    });
  }

  detectCollisions(): boolean {   
    for(let i = 0; i < this.desks.length; i++) {
      this.desks[i].collide = 0;
      for(let j = 0; j < this.desks.length; j++) {

        const deskI = this.desks[i];
        const deskJ = this.desks[j];

        // space border Desk I
        const spaceBorderLeftI = deskI.positionX - (this.spaceWidth - deskI.width) / 2;
        const spaceBorderTopI = deskI.positionY - (this.spaceWidth - deskI.width) / 2;
        const spaceBorderRightI = deskI.positionX + deskI.width + (this.spaceWidth - deskI.width) / 2;
        const spaceBorderBottomI = deskI.positionY + deskI.height
         + (this.spaceHeight - ((this.spaceWidth - deskI.width) / 2 + deskI.height));

        // space border Desk J
        const spaceBorderLeftJ = deskJ.positionX - (this.spaceWidth - deskJ.width) / 2;
        const spaceBorderTopJ = deskJ.positionY - (this.spaceWidth - deskJ.width) / 2;
        const spaceBorderRightJ = deskJ.positionX + deskJ.width + (this.spaceWidth - deskJ.width) / 2;
        const spaceBorderBottomJ = deskJ.positionY + deskJ.height
         + (this.spaceHeight - ((this.spaceWidth - deskJ.width) / 2 + deskJ.height));

        if (deskI.id === deskJ.id) {
          continue;
        }

        // collision detect
        if (spaceBorderTopI === spaceBorderTopJ && spaceBorderRightI === spaceBorderRightJ
           && spaceBorderBottomI === spaceBorderBottomJ && spaceBorderLeftI === spaceBorderLeftJ) {
            deskI.collide = 1;
        } else if (spaceBorderBottomI === spaceBorderBottomJ) {
          if (((spaceBorderLeftI < spaceBorderLeftJ && (spaceBorderRightI < spaceBorderRightJ && spaceBorderRightI > spaceBorderLeftJ)))
          || ((spaceBorderRightI > spaceBorderRightJ && (spaceBorderLeftI > spaceBorderLeftJ && spaceBorderLeftI < spaceBorderRightJ)))) {
            deskI.collide = 1;
          }
        } else if (spaceBorderTopI === spaceBorderTopJ) {
          if (((spaceBorderLeftI < spaceBorderLeftJ && (spaceBorderRightI < spaceBorderRightJ && spaceBorderRightI > spaceBorderLeftJ)))
          || ((spaceBorderRightI > spaceBorderRightJ && (spaceBorderLeftI > spaceBorderLeftJ && spaceBorderLeftI < spaceBorderRightJ)))) {
            deskI.collide = 1;
          }
        } else if (spaceBorderLeftI === spaceBorderLeftJ) {
          if (((spaceBorderTopI < spaceBorderTopJ && (spaceBorderBottomI < spaceBorderBottomJ && spaceBorderBottomI > spaceBorderTopJ))
          || (spaceBorderBottomI > spaceBorderBottomJ && (spaceBorderTopI > spaceBorderTopJ && spaceBorderTopI < spaceBorderBottomJ)))) {
            deskI.collide = 1;
          }
        } else if (spaceBorderRightI === spaceBorderRightJ) {
          if (((spaceBorderTopI < spaceBorderTopJ && (spaceBorderBottomI < spaceBorderBottomJ && spaceBorderBottomI > spaceBorderTopJ))
          || (spaceBorderBottomI > spaceBorderBottomJ && (spaceBorderTopI > spaceBorderTopJ && spaceBorderTopI < spaceBorderBottomJ)))) {
            deskI.collide = 1;
          }
        } else if (((spaceBorderTopI < spaceBorderTopJ && (spaceBorderBottomI < spaceBorderBottomJ && spaceBorderBottomI > spaceBorderTopJ))
        || (spaceBorderBottomI > spaceBorderBottomJ && (spaceBorderTopI > spaceBorderTopJ && spaceBorderTopI < spaceBorderBottomJ)))
        && ((spaceBorderLeftI  < spaceBorderLeftJ && (spaceBorderRightI < spaceBorderRightJ && spaceBorderRightI > spaceBorderLeftJ)
        || (spaceBorderRightI > spaceBorderRightJ && (spaceBorderLeftI > spaceBorderLeftJ && spaceBorderLeftI < spaceBorderRightJ))))) {
          deskI.collide = 1;
        }

        // console.log(
        //   '%cDeskI id: ' + deskI.id + '\nDeskJ id: ' + deskJ.id, 'color: red; font-weight: 700'
        // );
        // console.log(
        //    'Top I: ' + spaceBorderTopI + 
        //    '\nTop J: ' + spaceBorderTopJ +
        //    '\nBottom I: ' + spaceBorderBottomI +
        //    '\nBottom J: ' + spaceBorderBottomJ +
        //    '\nLeft I: ' + spaceBorderLeftI +
        //    '\nLeft J: ' + spaceBorderLeftJ +
        //    '\nRight I: ' + spaceBorderRightI +
        //    '\nRight J: ' + spaceBorderRightJ 
        // );

        // console.log(
        //   `%c${((spaceBorderTopI < spaceBorderTopJ && (spaceBorderBottomI < spaceBorderBottomJ && spaceBorderBottomI > spaceBorderTopJ)) || // same level
        //        (spaceBorderBottomI > spaceBorderBottomJ && (spaceBorderTopI > spaceBorderTopJ && spaceBorderTopI < spaceBorderBottomJ))) &&
        //        ((spaceBorderLeftI  < spaceBorderLeftJ && (spaceBorderRightI < spaceBorderRightJ && spaceBorderRightI > spaceBorderLeftJ) ||
        //        (spaceBorderRightI > spaceBorderRightJ && (spaceBorderLeftI > spaceBorderLeftJ && spaceBorderLeftI < spaceBorderRightJ))))}`,
        //   'color: green; font-weight: 900;'
        // )
      }
    }

    for(let i = 0; i < this.desks.length; i++) {
      if (this.desks[i].collide === 1) {
        return true;
      }
    }
    return false;
  }

  newDeskToRoom() {
    const desk = new Desk(this.numberOfDesks--, 70, 150, 25, 25, 1, -1, -1, -1);
    this.desks.push(desk);
    this.detectCollisions();
  }

  changeDeskDirection(): void {
    if (this.selectedDesk) {
      if (this.selectedDesk.direction < 4) {
        this.selectedDesk.direction++;
      } else {
        this.selectedDesk.direction = 1;
      }
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.key) {
      case 'r':
        this.changeDeskDirection();
        break;
      case 'c':
        this.detectCollisions();
        break;
      case 'w':
        if (this.selectedDesk) {
          this.selectedDesk.positionY -= 1;
        }
        break;
      case 'd':
        if (this.selectedDesk) {
          this.selectedDesk.positionX += 1;
        }
        break;
      case 's':
        if (this.selectedDesk) {
          this.selectedDesk.positionY += 1;
        }
        break;
      case 'a':
        if (this.selectedDesk) {
          this.selectedDesk.positionX -= 1;
        }
        break;
    }

    this.detectCollisionsAndEmit();
    this.correctDesksPositions();

  }

  resetRoom() {
    this.desks = [];
  }

}
