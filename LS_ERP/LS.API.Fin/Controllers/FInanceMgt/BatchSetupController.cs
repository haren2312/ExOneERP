﻿using CIN.Application;
using CIN.Application.Common;
using CIN.Application.FinanceMgtDtos;
using CIN.Application.FinanceMgtQuery;
using CIN.Application.SystemSetupDtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace LS.API.Fin.Controllers.FInanceMgt
{
    public class BatchSetupController : BaseController
    {
        public BatchSetupController(IOptions<AppSettingsJson> appSettings) : base(appSettings)
        {
        }

        [HttpGet("getBatchSetupSelectList")]
        public async Task<IActionResult> GetBatchSetupSelectList()
        {
            var obj = await Mediator.Send(new GetBatchSetupSelectList() { User = UserInfo() });
            return obj is not null ? Ok(obj) : NotFound(new ApiMessageDto { Message = ApiMessageInfo.NotFound });
        }

        [HttpGet("getBatchSetupSearchSelectList")]
        public async Task<IActionResult> GetBatchSetupSearchSelectList([FromQuery] string search)
        {
            var obj = await Mediator.Send(new GetBatchSetupSearchSelectList() { Search = search, User = UserInfo() });
            return obj is not null ? Ok(obj) : NotFound(new ApiMessageDto { Message = ApiMessageInfo.NotFound });
        }

    }
}