﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        public int? FirstPersonInDutyId { get; set; }
        [Column(TypeName = "date")]
        public DateTime DutyStartDate { get; set; }
        [Required]
        public int Sprints { get; set; }
        public List<Person> Persons { get; set; }
        public Team()
        {
            Persons = new List<Person>();
        }
    }
}
