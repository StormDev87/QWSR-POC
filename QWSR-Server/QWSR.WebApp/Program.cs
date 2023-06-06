using System.Text.Json.Serialization;
using QWSR.Auxiliary;
using QWSR.Logics.SignalR;
using QWSR.Worker;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Configure open cors -- Improve for production use. 
builder.Services.AddCors(o =>
{
    o.AddPolicy("AllowAll", policyBuilder =>
        policyBuilder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true)
        
    );
});

builder.Services.AddHostedService<ServiceRealtime>();
builder.Services.AddSingleton<BusData>();

builder.Services.AddSignalR(options => 
{ 
    options.EnableDetailedErrors = true;
}).AddJsonProtocol(options => options.PayloadSerializerOptions.NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals); 

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<RtHub>("/RT");

app.Run();
