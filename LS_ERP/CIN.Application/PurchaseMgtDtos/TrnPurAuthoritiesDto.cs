﻿using AutoMapper;
using CIN.Application;
using CIN.Domain.PurchaseMgt;
using CIN.Domain.SystemSetup;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIN.Application.PurchaseMgtDtos
{
    [AutoMap(typeof(TblPurAuthorities))]
    public class TrnPurAuthoritiesDto : PrimaryKeyDto<int>
    {

        public int AppAuth { get; set; }  //reference from tblErpSysLogin loginId
        [StringLength(20)]
        public string BranchCode { get; set; }
        public short AppLevel { get; set; }
        public bool PurchaseRequest { get; set; }
        public bool PurchaseOrder { get; set; }

        public bool PurchaseReturn { get; set; }

        public bool IsActive { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CreatedOn { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ModifiedOn { get; set; }

    }
}