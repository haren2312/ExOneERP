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
    [AutoMap(typeof(TblHRMSysReligion))]
    public class TblHRMSysReligionDto : AutoGeneratedIdKeyAuditableEntityDto<int>
    {
        [Required]
        [StringLength(20)]
        public string ReligionCode { get; set; }
        [Required]
        [StringLength(100)]
        public string ReligionNameEn { get; set; }
        [Required]
        [StringLength(100)]
        public string ReligionNameAr { get; set; }
        public bool IsDelete { get; set; }
    }
}