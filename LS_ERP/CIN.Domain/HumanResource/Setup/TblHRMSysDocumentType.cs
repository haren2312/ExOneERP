﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIN.Domain.HumanResource.Setup
{
    [Table("tblHRMSysDocumentType")]
    public class TblHRMSysDocumentType : AutoGeneratedIdKeyAuditableEntity<int>
    {
        [StringLength(20)]
        [Key]
        public string DocumentTypeCode { get; set; }
        [Required]
        [StringLength(100)]
        public string DocumentTypeNameEn { get; set; }
        [Required]
        [StringLength(100)]
        public string DocumentTypeNameAr { get; set; }
        [Required]
        public bool IsMandatory { get; set; }
    }
}