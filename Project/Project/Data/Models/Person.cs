﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Models
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int? TeamId { get; set; } 
        public Team Team { get; set; }
    }
}
