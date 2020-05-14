using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project.Data.Models
{
    public class Vacation
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Reason { get; set; }
        [Required]
        [Column(TypeName = "date")]
        public DateTime StartDate { get; set; }
        [Required]
        [Column(TypeName = "date")]
        public DateTime EndDate { get; set; }
        public int? PersonId { get; set; }
        public Person Person { get; set; }
    }
}
