﻿using AutoMapper;
using CIN.Domain.HumanResource.Setup;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIN.Application.HumanResource.SetUp.HRMSetUpDtos
{
    [AutoMap(typeof(TblHRMSysPosition))]
    public class TblHRMSysPositionDto : AutoGeneratedIdKeyAuditableEntityDto<int>
    {
        [Required]
        [StringLength(20)]
        public string PositionCode { get; set; }
        [Required]
        [StringLength(100)]
        public string PositionNameEn { get; set; }
        [StringLength(100)]
        public string PositionNameAr { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        public bool IsDelete { get; set; }
    }
}