// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.SharePoint;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.SharePoint;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CollectFeedbackBotPoweredAce
{

  public class CollectFeedbackBot : SharePointActivityHandler
  {
    private static string adaptiveCardExtensionId = Guid.NewGuid().ToString();
    private readonly IConfiguration _configuration = null;
    public readonly string _baseUrl;

    private static ConcurrentDictionary<string, CardViewResponse> cardViews = new ConcurrentDictionary<string, CardViewResponse>();

    private static string CollectFeedbackCardView_ID = "GET_FEEDBACK_CARD_VIEW";
    private static string OkFeedbackCardView_ID = "OK_FEEDBACK_CARD_VIEW";
    private static string FeedbackQuickView_ID = "FEEDBACK_QUICK_VIEW";
    public CollectFeedbackBot(IConfiguration configuration) : base()
    {
      this._configuration = configuration;
      this._baseUrl = configuration["BaseUrl"];

      // ************************************
      // Add the CardViews
      // ************************************

      // Prepare ACE data for all Card Views
      var aceData = new AceData()
      {
        Title = "Your voice matters!",
        CardSize = AceData.AceCardSize.Large,
        DataVersion = "1.0",
        Id = adaptiveCardExtensionId
      };

      // Collect Feedback Card View (Input Text Card View)
      CardViewResponse feedbackCardViewResponse = new CardViewResponse();
      feedbackCardViewResponse.AceData = aceData;
      feedbackCardViewResponse.CardViewParameters = CardViewParameters.TextInputCardViewParameters(
          new CardBarComponent()
          {
            Id = "FeedbackCardView",
          },
          new CardTextComponent()
          {
            Text = "Please, provide feedback"
          },
          new CardTextInputComponent()
          {
            Id = "feedbackValue",
            Placeholder = "Your feedback ..."
          },
          new List<CardButtonComponent>()
          {
                new CardButtonComponent()
                {
                    Id = "SendFeedback",
                    Title = "Submit",
                    Action = new SubmitAction()
                    {
                        Parameters = new Dictionary<string, object>()
                        {
                            {"viewToNavigateTo", OkFeedbackCardView_ID}
                        }
                    }
                }
          },
          new Microsoft.Bot.Schema.SharePoint.CardImage()
          {
            Image = $"{_baseUrl}/Media/Collect-Feedback.png",
            AltText = "Collect feedback picture"
          });
      feedbackCardViewResponse.ViewId = CollectFeedbackCardView_ID;

      feedbackCardViewResponse.OnCardSelection = new QuickViewAction()
      {
        Parameters = new QuickViewActionParameters()
        {
          View = FeedbackQuickView_ID
        }
      };

      cardViews.TryAdd(feedbackCardViewResponse.ViewId, feedbackCardViewResponse);

      // OK Feedback Card View (Image Card View)
      CardViewResponse okFeedbackCardViewResponse = new CardViewResponse();
      okFeedbackCardViewResponse.AceData = aceData;
      okFeedbackCardViewResponse.CardViewParameters = CardViewParameters.ImageCardViewParameters(
          new CardBarComponent()
          {
            Id = "OkFeedbackCardView",
          },
          new CardTextComponent()
          {
            Text = "Here is your feedback '<feedback>' collected on '<dateTimeFeedback>'"
          },
          new List<BaseCardComponent>()
          {
                new CardButtonComponent()
                {
                    Id = "OkButton",
                    Title = "Ok",
                    Action = new SubmitAction()
                    {
                        Parameters = new Dictionary<string, object>()
                        {
                            {"viewToNavigateTo", CollectFeedbackCardView_ID}
                        }
                    }
                }
          },
          new Microsoft.Bot.Schema.SharePoint.CardImage()
          {
            Image = $"{_baseUrl}/Media/Ok-Feedback.png",
            AltText = "Feedback collected"
          });
      okFeedbackCardViewResponse.ViewId = OkFeedbackCardView_ID;

      okFeedbackCardViewResponse.OnCardSelection = new QuickViewAction()
      {
        Parameters = new QuickViewActionParameters()
        {
          View = FeedbackQuickView_ID
        }
      };

      cardViews.TryAdd(okFeedbackCardViewResponse.ViewId, okFeedbackCardViewResponse);
    }

    protected override Task<CardViewResponse> OnSharePointTaskGetCardViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
    {
      return base.OnSharePointTaskGetCardViewAsync(turnContext, aceRequest, cancellationToken);
    }

    protected override Task<QuickViewResponse> OnSharePointTaskGetQuickViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
    {
      return base.OnSharePointTaskGetQuickViewAsync(turnContext, aceRequest, cancellationToken);
    }

    // protected override Task<GetPropertyPaneConfigurationResponse> OnSharePointTaskGetPropertyPaneConfigurationAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
    // {
    //   return base.OnSharePointTaskGetPropertyPaneConfigurationAsync(turnContext, aceRequest, cancellationToken);
    // }

    // protected override Task<BaseHandleActionResponse> OnSharePointTaskSetPropertyPaneConfigurationAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
    // {
    //   return base.OnSharePointTaskSetPropertyPaneConfigurationAsync(turnContext, aceRequest, cancellationToken);
    // }

    protected override Task<BaseHandleActionResponse> OnSharePointTaskHandleActionAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
    {
      return base.OnSharePointTaskHandleActionAsync(turnContext, aceRequest, cancellationToken);
    }
  }
}