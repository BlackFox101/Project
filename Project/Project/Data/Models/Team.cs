using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Data.Models
{
    public class Team
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
        [Required]
        public int DutyDuration { get; set; }
        public List<Person> Persons { get; set; }
        public Team()
        {
            Persons = new List<Person>();
        }
    }
}
