using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Project.Data;
using Project.Models;

namespace Project.Controllers
{
    public class HomeController : Controller
    {
        private AppDBContext db;
        public HomeController(AppDBContext context)
        {
            db = context;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
