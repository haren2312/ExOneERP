﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIN.Domain.HumanResource.Setup
{
    [Table("tblHRMSysInsuranceProvider")]
    public class TblHRMSysInsuranceProvider: AutoGeneratedIdKeyAuditableEntity<int>
    {
        [StringLength(20)]
        [Key]
        public string InsuranceProviderCode { get; set; }
        [Required]
        [StringLength(100)]
        public string InsuranceProviderNameEn { get; set; }
        [Required]
        [StringLength(100)]
        public string InsuranceProviderNameAr { get; set; }
    }
}