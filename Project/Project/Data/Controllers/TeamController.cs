﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Models;

namespace Project.Data.Controllers
{
    public class TeamController : Controller
    {
        private AppDBContext db;
        public TeamController(AppDBContext context)
        {
            db = context;
        }
        public async Task<IActionResult> Index()
        {
            return View(await db.Teams.ToListAsync());
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(Team user)
        {
            db.Teams.Add(user);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }
    }
}
