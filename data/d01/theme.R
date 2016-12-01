theme_pub = theme_classic(base_size = 24) + 
  theme(axis.line.x = element_line(colour = "black", size = 0.4),
        axis.line.y = element_line(colour = "black", size = 0.4),
        strip.background = element_rect(fill = 'gainsboro', color = 'gainsboro', size = 1.1),
        strip.text = element_text(face = 'bold')
  )

theme_set(theme_pub)