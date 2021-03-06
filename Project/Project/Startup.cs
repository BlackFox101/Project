using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Project.Data;

namespace Project
{
����public class Startup
����{
��������public Startup(IConfiguration configuration)
��������{
������������Configuration = configuration;
��������}
�
��������public IConfiguration Configuration { get; }
�
��������public void ConfigureServices(IServiceCollection services)
��������{
������������// �������� ������ ����������� �� ����� ������������
            string connection = Configuration.GetConnectionString("DefaultConnection");
            // ��������� �������� MobileContext � �������� ������� � ����������
            services.AddDbContext<AppDBContext>(options =>
                options.UseSqlServer(connection));
������������services.AddControllersWithViews();
            services.AddMvc();
        }
�
��������public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
��������{
������������app.UseHttpsRedirection();
������������app.UseStaticFiles();
������������app.UseRouting();
������������app.UseAuthorization();
������������app.UseEndpoints(endpoints =>
������������{
����������������endpoints.MapControllerRoute(
��������������������name: "default",
��������������������pattern: "{controller=Person}/{action=Index}/{id?}");
������������});
��������}
    }
}
