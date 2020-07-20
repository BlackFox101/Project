using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Data.Models
{
    public class SprintHour
    {
        public int Id { get; set; }
        [Required]
        public int Hours { get; set; }
        public int? PersonId { get; set; }
        public Person Person { get; set; }
    }
}
