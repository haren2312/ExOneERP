﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIN.Domain.HumanResource.Setup
{
    [Table("tblHRMSysBloodGroup")]
    public class TblHRMSysBloodGroup : AutoGeneratedIdKeyAuditableEntity<int>
    {
        [StringLength(20)]
        [Key]
        public string BloodGroupCode { get; set; }
        [Required]
        [StringLength(100)]
        public string BloodGroupNameEn { get; set; }
        [Required]
        [StringLength(100)]
        public string BloodGroupNameAr { get; set; }
    }
}
