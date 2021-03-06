﻿using System;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using DotNetify;
using DotNetify.Security;

namespace WebApplication.Core.React
{
   public class Startup
   {
      // This method gets called by the runtime. Use this method to add services to the container.
      // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
      public void ConfigureServices( IServiceCollection services )
      {
         services.AddMvc();
         services.AddLocalization();

         services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();  // Required by ReactJS.NET.
         services.AddSignalR();  // Required by dotNetify.

         services.AddDotNetify();
      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure( IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory )
      {
         app.UseStaticFiles();
         app.UseAuthServer(); // Provide auth tokens.

         app.UseWebSockets();
         app.UseSignalR(); // Required by dotNetify.
         app.UseDotNetify(config =>
         {
            string secretKey = "dotnetifydemo_secretkey_123!";
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
            var tokenValidationParameters = new TokenValidationParameters
            {
               IssuerSigningKey = signingKey,
               ValidAudience = "DotNetifyDemoApp",
               ValidIssuer = "DotNetifyDemoServer",
               ValidateIssuerSigningKey = true,
               ValidateAudience = true,
               ValidateIssuer = true,
               ValidateLifetime = true,
               ClockSkew = TimeSpan.FromSeconds(0)
            };

            // Middleware to log incoming/outgoing message; default to Sytem.Diagnostic.Trace.
            config.UseDeveloperLogging();

            // Middleware to do authenticate token in incoming request headers.
            config.UseJwtBearerAuthentication(tokenValidationParameters);

            // Filter to check whether user has permission to access view models with [Authorize] attribute.
            config.UseFilter<AuthorizeFilter>();

            // Demonstration middleware that extracts auth token from incoming request headers.
            config.UseMiddleware<ExtractAccessTokenMiddleware>(tokenValidationParameters);

            // Demonstration filter that passes access token from the middleware to the ViewModels.SecurePageVM class instance.
            config.UseFilter<SetAccessTokenFilter>();
         });

         app.UseMvc(routes =>
         {
            routes.MapRoute(
                   name: "default",
                   template: "{controller=Home}/{action=Index}/{id?}");
         });
      }
   }
}
