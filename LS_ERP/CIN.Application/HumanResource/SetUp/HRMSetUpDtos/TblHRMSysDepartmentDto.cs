﻿using AutoMapper;
using CIN.Domain;
using CIN.Domain.HumanResource.Setup;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIN.Application.HumanResource.SetUp.HRMSetUpDtos
{
    [AutoMap(typeof(TblHRMSysDepartment))]
    public class TblHRMSysDepartmentDto : AutoGeneratedIdKeyAuditableEntityDto<int>
    {
        [Required]
        [StringLength(20)]
        public string DepartmentCode { get; set; }
        [Required]
        [StringLength(100)]
        public string DepartmentNameEn { get; set; }
        [StringLength(100)]
        public string DepartmentNameAr { get; set; }
        [Required]
        [StringLength(20)]
        public string DivisionCode { get; set; }
        [StringLength(100)]
        public string DivisionName { get; set; }
    }
}