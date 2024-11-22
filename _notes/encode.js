const { default: LZString } = await import("lz-string");
let data = [{
    "name": "app.R",
    "content": `library(shiny)

ui <- fluidPage(
  titlePanel("Basic Shiny App"),
  sidebarLayout(
    sidebarPanel(
      helpText("This is a basic Shiny app.")
    ),
    mainPanel(
      textOutput("text")
    )
  )
)

server <- function(input, output) {
  output$text <- renderText({
    "Hello, Shiny!"
  })
}

shinyApp(ui, server)`,
}]
console.log(LZString.compressToEncodedURIComponent(JSON.stringify(data)))
