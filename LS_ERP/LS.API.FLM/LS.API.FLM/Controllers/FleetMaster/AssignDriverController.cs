﻿using CIN.Application;
using CIN.Application.Common;
using CIN.Application.FleetMgtDtos;
using CIN.Application.FleetMgtQuery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LS.API.FLM.Controllers.FleetMaster
{
    public class AssignDriverController :BaseController
    {
        private IConfiguration _Config;

        public AssignDriverController(IOptions<AppSettingsJson> appSettings, IConfiguration config) : base(appSettings)
        {
            _Config = config;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] PaginationFilterDto filter)
        {
            var list = await Mediator.Send(new GetAssignDriverList() { Input = filter, User = UserInfo() });
            return Ok(list);
        }


        [HttpPost]
        public async Task<ActionResult> Create([FromBody] AssignDriversDto dTO)
        {
            var id = await Mediator.Send(new CreateUpdateAssignDriver() { AssingDriver = dTO, User = UserInfo() });
            if (id > 0)
                return Created($"get/{id}", dTO);
            else if (id == -1)
            {
                return BadRequest(new ApiMessageDto { Message = ApiMessageInfo.Duplicate(nameof(dTO.Id)) });
            }
            return BadRequest(new ApiMessageDto { Message = ApiMessageInfo.Failed });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            var obj = await Mediator.Send(new GetAssignDriverById() { Id = id, User = UserInfo() });
            return obj is not null ? Ok(obj) : NotFound(new ApiMessageDto { Message = ApiMessageInfo.NotFound });
        }



        [HttpDelete("DeleteAssignDriver")]
        public async Task<ActionResult> DeleteAssignDriver([FromQuery] int id)
        {
            var driverId = await Mediator.Send(new DeleteAssignDriver() { Id = id, User = UserInfo() });
            if (driverId > 0)
                return Ok(new MobileApiMessageDto { Message = "Successfully Deleted", Status = true });
            return BadRequest(new MobileApiMessageDto { Message = ApiMessageInfo.Failed, Status = false });
        }

    }
}