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
    [AutoMap(typeof(TblHRMSysDegreeType))]
    public class TblHRMSysDegreeTypeDto : AutoGeneratedIdKeyAuditableEntityDto<int>
    {
        [Required]
        [StringLength(20)]
        public string DegreeTypeCode { get; set; }
        [Required]
        [StringLength(100)]
        public string DegreeTypeNameEn { get; set; }
        [StringLength(100)]
        public string DegreeTypeNameAr { get; set; }
    }
}