﻿using AutoMapper;
using CIN.Application;
using CIN.Application.Common;
using CIN.Application.TeacherMgtDtos;
using CIN.Application.TeacherAppMgtQuery;
using CIN.DB;
using CIN.Server;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LS.API.TeacherApp.Controllers.Teacher_Admin
{
    public class TeacherMappedGradeController : BaseController
    {
        private IConfiguration _Config;

        public TeacherMappedGradeController(IOptions<AppSettingsJson> appSettings, IConfiguration config) : base(appSettings)
        {
            _Config = config;
        }

        [HttpGet("getTeacherGradeMappingList")]
        public async Task<IActionResult> Get([FromQuery] string teacherCode)
        {
            var list = await Mediator.Send(new GetTeacherGradeMappingList() { TeacherCode = teacherCode, User = UserInfo() });
            return Ok(list);
        }
    }
}
