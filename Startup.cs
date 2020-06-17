using iSpindelAngular.Data;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace iSpindelAngular
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            var serverType = 0;
            var readOnly = false;
            if (Configuration != null)
            {
                if (!int.TryParse(Configuration["ServerType"], out serverType)) serverType = 0;
                if (!bool.TryParse(Configuration["ReadOnly"], out readOnly)) readOnly = false;
            }
            LogDb.ReadOnly = readOnly;
            if (serverType == 1)
                services.AddDbContext<LogDbContext>(options => options.UseSqlite(Configuration.GetConnectionString("iSpindelSqlite")));
            else
                services.AddDbContext<LogDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("iSpindelSqlServer")));

            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");
            //services.AddMvc();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // NB: This does not need to force secure communications
            //app.UseHttpsRedirection();

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            //Add logging middleware to the pipeline
            if (Configuration != null && bool.Parse(Configuration["RequestLogging:LogRequests"]))
            {
                app.UseMiddleware<RequestResponseLoggingMiddleware>(Configuration["RequestLogging:LogRequestPath"]);
            }

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            //app.Use(async (context, next) =>
            //{
            //    string path = context.Request.Path.Value;
            //    if (path != null && !path.ToLower().Contains("/api"))
            //    {
            //        // XSRF-TOKEN used by angular in the $http if provided
            //        var tokens = antiforgery.GetAndStoreTokens(context);
            //        context.Response.Cookies.Append("XSRF-TOKEN", 
            //            tokens.RequestToken, new CookieOptions { 
            //                HttpOnly = false, 
            //                Secure = true
            //            }
            //        );
            //    }
            //    await next();
            //});

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
