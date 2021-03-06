﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Data.Models
{
    public class Person
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [Required]
        [MaxLength(100)]
        public string Position { get; set; }
        [Required]
        public bool Duty { get; set; }
        public int? TeamId { get; set; }
        [Required]
        public double Coefficient { get; set; }
        public Team Team { get; set; }
        public List<Vacation> Vacations { get; set; }
        public List<SprintHour> SprintHours { get; set; }
        public Person()
        {
            Vacations = new List<Vacation>();
            SprintHours = new List<SprintHour>();
        }
    }
}
