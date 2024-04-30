import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AcebotAdaptiveCardExtensionStrings';
import {
  IAcebotAdaptiveCardExtensionProps,
  IAcebotAdaptiveCardExtensionState,
} from '../AcebotAdaptiveCardExtension';
//import { Guid } from '@microsoft/sp-core-library';

export class CardView extends BaseComponentsCardView<
  IAcebotAdaptiveCardExtensionProps,
  IAcebotAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      footer: {
        componentName: 'textInput',
        id: 'chatMessage',
        placeholder: "Enter your question",
        button: {
          icon: {
            url: 'Send'
          },
          action: {
            type: 'Submit',
            parameters: {
              id: 'chatMessage'
            }
          }
        }
      }
    });
  }

  public async onAction(action: IActionArguments): Promise<void> {
    if (action.type === 'Submit' && action.data?.id === 'chatMessage') {
      const fetch = require('node-fetch');
      // const guid = Guid.newGuid();
      // const token = await await fetch(
      //   'https://directline.botframework.com/v3/directline/tokens/generate',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IjdTRFdtMHJZNGpaYXRPZS16eU4wRmhfV3lINHhsNDNpckYtM3FaSFVpU2MiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2ljMy50ZWFtcy5vZmZpY2UuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYjc0YzljMWEtZWFjMC00Y2I5LTgwNTktZWM0MTc1Zjk0NmE0LyIsImlhdCI6MTcxMjIzNjcxMywibmJmIjoxNzEyMjM2NzEzLCJleHAiOjE3MTIzMjM0MTMsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUE3NXJWdUN5UFhaUSszWXBxNmQ2KzZLVlEyZWV6ZnJGZHBJdU1aaEpjcDdzU3JlNE53aGY4WDFQOU0xcUZ3Y2lBSE44S3hQcFlZcmZQR1FwUlhXbVRhSWZYWU1kTzY0U3l0TXRLNTk5Ym5abz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiNWUzY2U2YzAtMmIxZi00Mjg1LThkNGItNzVlZTc4Nzg3MzQ2IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJDYXNoLVBldGVyc29uIiwiZ2l2ZW5fbmFtZSI6IkRlcmVrIiwiaXBhZGRyIjoiMTUzLjkyLjE0NS41MyIsIm5hbWUiOiJEZXJlayBDYXNoLVBldGVyc29uIiwib2lkIjoiNGUyYjBkZWItN2RkNy00ZmZlLTk0MWItOTM3YjBlNTE5YWFmIiwicHVpZCI6IjEwMDMyMDAzNEVGQUFDQjkiLCJyaCI6IjAuQWFnQUdweE10OERxdVV5QVdleEJkZmxHcEZUd3FqbWxnY2RJcFBnQ2t3RWdsYm56QUFrLiIsInNjcCI6IlRlYW1zLkFjY2Vzc0FzVXNlci5BbGwiLCJzdWIiOiJzeHBTVm5UaUxXZ2Uwazgzd2xtUU5CbEExd0JDOG9YN3J2ZGZPb3JpTlVVIiwidGlkIjoiYjc0YzljMWEtZWFjMC00Y2I5LTgwNTktZWM0MTc1Zjk0NmE0IiwidW5pcXVlX25hbWUiOiJEZXJla0Nhc2gtUGV0ZXJzb25AbTM2NWRjcC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJEZXJla0Nhc2gtUGV0ZXJzb25AbTM2NWRjcC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiIxdHoyUHVkMVRrZVd6aVloS0lMb0FBIiwidmVyIjoiMS4wIiwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSJ9.r-pEaO-YMKi3EkABa6l5-pDzEJhXLRuG6Jqvoq2A3wJOKZ0ZnK8YV-KZ6rhERaivRR0TV8PE8bJzvkkL_9I7iFJ0Cfzyx2pDilQQWTLZ-VDqc6OPRjx7mKgYdGivdpCTGtEnEtdMUUXIov7T46dRtaf3gEI3lcb9ZihRfLEjfxsNidp2nf4XYRZmClO9X8YXl90ksYP8QIOd2ybrPVkBokWHyWs977V9DcQb3wrJsug0Rdkdp8YAaWZ_pyc-WcH__X3McZ7lQS5E8G02NWZoAJCRUFjONVAO8IZlDUdAi84YxdjxT9KxONZlxh0fqYZtNQod9UdoJBEr0SFffdW6rA'
      //     }
      //   });
      
      //   HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, dlUrl);
      //   request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", secret);
      //   request.Content = new StringContent(
      //       JsonConvert.SerializeObject(
      //           new { User = new { Id = userId } }),
      //           Encoding.UTF8,
      //           "application/json");

      //   var response = await client.SendAsync(request);

      //   string token = String.Empty;
      //   if (response.IsSuccessStatusCode)
      //   {
      //       var body = await response.Content.ReadAsStringAsync();
      //       token = JsonConvert.DeserializeObject<DirectLineToken>(body).token;
      //   }
      
      const convResponse = await fetch(
        'https://directline.botframework.com/v3/directline/conversations',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer gvswrMwuCUU.TNehwSLlV9EgVOuwwoSUbIxvohs1BBpjdPDhoVgwEhI'
          }
        })
      const conversation = await convResponse.json();
      console.log(conversation);
  
      let chatMessage = {
        "locale": "en-EN",
        "type": "message",
        "from": {
          "id": "joe"
        },
        "text": action.data?.chatMessage
      };
      
      const msgResponse = await fetch(
        `https://directline.botframework.com/v3/directline/conversations/${conversation?.conversationId}/activities`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer gvswrMwuCUU.TNehwSLlV9EgVOuwwoSUbIxvohs1BBpjdPDhoVgwEhI',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(chatMessage)
        })
      const message = await msgResponse.json();
      console.log(message);
        
      const actResponse = await fetch(
        `https://directline.botframework.com/v3/directline/conversations/${conversation?.conversationId}/activities`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer gvswrMwuCUU.TNehwSLlV9EgVOuwwoSUbIxvohs1BBpjdPDhoVgwEhI',
            'Content-Type': 'application/json'
          }
        })
      const activity = await actResponse.json();
      console.log(activity);
    }
  }
}
