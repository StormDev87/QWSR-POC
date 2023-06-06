FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["QWSR.WebApp/QWSR.WebApp.csproj", "QWSR.WebApp/"]
COPY ["QWSR.Auxiliary/QWSR.Auxiliary.csproj", "QWSR.Auxiliary/"]
COPY ["QWSR.Worker/QWSR.Worker.csproj", "QWSR.Worker/"]
COPY ["QWSR.Logics/QWSR.Logics.csproj", "QWSR.Logics/"]
RUN dotnet restore "QWSR.WebApp/QWSR.WebApp.csproj"
COPY . .
WORKDIR "/src/QWSR.WebApp"
RUN dotnet build "QWSR.WebApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "QWSR.WebApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "QWSR.WebApp.dll"]
