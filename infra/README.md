# Terraform Azure Infrastructure

## Terraform Commands

```bash
# Initialize Terraform and download providers
terraform init

# Preview changes before applying
terraform plan

# Apply changes to create/update infrastructure
terraform apply
```

## Resources Created

- Azure resource group for all assets
- Static website-enabled Storage Account that serves the built site
- Azure Front Door Standard profile, endpoint, origin group, and route pointing at the static site
- Azure Front Door custom domain + managed TLS certificate for `finnminn.com`

## Custom Domain Setup

Setting up the custom domain requires a manual step to validate domain ownership.

1.  **Apply Terraform:** Run `terraform apply` to create the Azure Front Door profile and other base resources. The initial run will likely fail at the custom domain step, but it is needed to generate the validation token.

2.  **Get Validation TXT Record:**
    *   Go to the Azure Portal and find the **Front Door Profile** that Terraform created.
    *   Navigate to the **Domains** section. You should see the `finnminn.com` domain with a "Pending" validation state.
    *   Click on the "Pending" status to view the validation details.
    *   Azure will provide a **TXT record** with a specific `Name` (like `_dnsauth.finnminn.com`) and a `Value` (a long string).

3.  **Add TXT Record to DNS:**
    *   In your DNS provider's dashboard (e.g., Namecheap, GoDaddy, or Azure DNS), add the TXT record you obtained from the Azure portal.
    *   Type: `TXT`
    *   Host/Name: `_dnsauth` (or the full name provided by Azure)
    *   Value: The validation code from Azure.
    *   TTL: `Automatic` or 3600.

4.  **Re-run Terraform:** Wait a few minutes for the DNS record to propagate. Then, run `terraform apply` again. This time, Azure Front Door will be able to validate your domain using the TXT record, create the custom domain resource, and provision the managed TLS certificate.

5.  **Point Your Domain:** The `dns.tf` file attempts to create the necessary `A` and `CNAME` records to route traffic from your domain to the Front Door endpoint. If you are managing your DNS zone outside of Azure, you may need to create these records manually:
    *   **Apex Domain (`finnminn.com`):** Create an `A` record pointing to the Front Door endpoint IP, or an `ALIAS`/`ANAME` record pointing to the Front Door hostname (`<your-endpoint-name>.azurefd.net`).
    *   **Subdomain (`www.finnminn.com`):** Create a `CNAME` record pointing to the Front Door hostname.

6.  **Verify:** Once `terraform apply` completes successfully and DNS has propagated, you can browse to `https://finnminn.com` to see your site.
