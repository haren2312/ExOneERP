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
    [AutoMap(typeof(TblHRMSysInsuranceType))]
    public class TblHRMSysInsuranceTypeDto : AutoGeneratedIdKeyAuditableEntityDto<int>
    {
        [Required]
        [StringLength(20)]
        public string InsuranceTypeCode { get; set; }
        [Required]
        [StringLength(100)]
        public string InsuranceTypeNameEn { get; set; }
        [Required]
        [StringLength(100)]
        public string InsuranceTypeNameAr { get; set; }
    }
}