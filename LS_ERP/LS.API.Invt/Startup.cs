using CIN.Application;
using CIN.DB;
using FluentValidation.AspNetCore;
using LS.API.Purchase.HttpContext;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LS.API.Purchase.HttpContext
{
    public static class HttpContext
    {
        private static IHttpContextAccessor _contextAccessor;

        public static Microsoft.AspNetCore.Http.HttpContext Current => _contextAccessor.HttpContext;

        internal static void Configure(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }
    }
    public static class StaticHttpContextExtensions
    {
        public static void AddHttpContextAccessor(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        public static IApplicationBuilder UseStaticHttpContext(this IApplicationBuilder app)
        {
            var httpContextAccessor = app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
            HttpContext.Configure(httpContextAccessor);
            return app;
        }
    }
}


namespace LS.API.Invt
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

            services.AddLocalization();
            // services.Configure<AppSettingsJson>(Configuration.GetSection("AppSettings"));

            services.AddMemoryCache();
            services.Configure<AppSettingsJson>(Configuration.GetSection("AppSettings"));
            services.Configure<RequestLocalizationOptions>(options =>
            {
                List<CultureInfo> supportedCultures = new()
                {
                    new("en-US"),
                    new("ar")
                    //new CultureInfo("ar-SA")
                };
                options.DefaultRequestCulture = new RequestCulture("en-US");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;

                options.RequestCultureProviders = new[]{ new RouteDataRequestProvider{
            IndexOfCulture=1,
                }};
            });


            services.AddMvc();
            services.AddApplication();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddDbContext<DMCContext>(options =>
               options.UseSqlServer(
                   Configuration.GetConnectionString("DMCConnection"),
                   b => b.MigrationsAssembly(typeof(DMCContext).Assembly.FullName)));

            services.AddDbContext<DMC2Context>(options =>
                           options.UseSqlServer(
                               Configuration.GetConnectionString("DMC2Connection"),
                               b => b.MigrationsAssembly(typeof(DMC2Context).Assembly.FullName)));

            services.AddDbContext<CINDBOneContext>((serviceProvider, dbContextBuilder) =>
            {
                var httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
                var connectionString = httpContextAccessor.HttpContext.Request.Headers["ConnectionString"].FirstOrDefault();
                if (connectionString is not null && !string.IsNullOrEmpty(connectionString))
                {
                    byte[] b = System.Convert.FromBase64String(connectionString);
                    string dbConnetion = System.Text.ASCIIEncoding.ASCII.GetString(b);
                    // dbConnetion = $"{dbConnetion.Replace(@"\\\\", @"\\")}";
                    dbContextBuilder.UseSqlServer($"{dbConnetion.Replace(@"\\", @"\")}");                   
                }
            });
            //services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddControllersWithViews(options =>
               options.Filters.Add<ApiExceptionFilterAttribute>())
                   .AddFluentValidation(x => x.AutomaticValidationEnabled = false);


             services.AddCors();


            // services.AddHttpContextAccessor();

            //services.AddControllers();
            //services.AddCors();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory logger)
        {
            logger.AddLog4Net();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApi v1"));

            var options = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(options.Value);

            // app.UseHttpsRedirection();

            // global cors policy
            //app.UseCors(x => x.WithOrigins("https://localhost:44364")
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //    .SetIsOriginAllowed(origin => true) // allow any origin
            //    .AllowCredentials()); // allow credentials


            // global cors policy
            app.UseCors(x =>
                //x.AllowAnyOrigin()
                //x.WithOrigins("http://localhost:43318")
                x.WithOrigins("http://shamimmn-002-site10.itempurl.com/", "http://20.68.125.92/ErpUi", "http://localhost:43318")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()); // allow credentials

            app.UseRouting();
            //app.UseAuthentication();
            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseStaticHttpContext();
        }
    }
   
}