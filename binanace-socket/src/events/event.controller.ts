import { Controller, Get } from '@nestjs/common';
import {EventsGateway} from "./events.gateway";

@Controller("/")
export class EventController {
  constructor(private readonly appService: EventsGateway) {}

  @Get()
  getHello(): string {
    return "Gateway work";
  }
}
