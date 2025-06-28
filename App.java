package com.example;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.genai.Client;
import com.google.genai.ResponseStream;
import com.google.genai.types.*;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;


public class App {
  public static void main(String[] args) {
    String apiKey = System.getenv("GEMINI_API_KEY");
    Client client = Client.builder().apiKey(apiKey).build();
    Gson gson = new Gson();


    String model = "gemini-2.5-pro";
    List<Content> contents = ImmutableList.of(
      Content.builder()
        .role("user")
        .parts(ImmutableList.of(
          Part.fromText("INSERT_INPUT_HERE")
        ))
        .build()
    );
    GenerateContentConfig config =
      GenerateContentConfig
      .builder()
      .thinkingConfig(
        ThinkingConfig
          .builder()
          .thinkingBudget(-1)
          .build()
      )
      .responseMimeType("text/plain")
      .build();

    ResponseStream<GenerateContentResponse> responseStream = client.models.generateContentStream(model, contents, config);

    for (GenerateContentResponse res : responseStream) {
      if (res.candidates().isEmpty() || res.candidates().get().get(0).content().isEmpty() || res.candidates().get().get(0).content().get().parts().isEmpty()) {
        continue;
      }

      List<Part> parts = res.candidates().get().get(0).content().get().parts().get();
      for (Part part : parts) {
        System.out.println(part.text());
      }
    }

    responseStream.close();
  }
}

